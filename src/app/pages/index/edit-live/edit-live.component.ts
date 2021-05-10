import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { UploadFile, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { UserService, EUserRole } from 'services/user.service';
import { Subscription } from 'rxjs';
import User from 'class/User';
import LiveRoom from 'class/live-room';
import { LiveService } from 'services/live.service';
import { CommonService } from 'services/common.service';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Component({
  selector: 'app-edit-live',
  templateUrl: './edit-live.component.html',
  styleUrls: ['./edit-live.component.scss']
})
export class EditLiveComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  selectedScope = 'major';
  selectedScopeId = '1';
  scopeData = ['major', 'class', 'student'];
  scopeName = ['院系','班级','学生'];
  scopeIdData: { [scope: string]: string[] } ;
  scopeNameData: { [scope: string]: string[] } ;

  roleType = EUserRole;
  userInfo: User;
  liveRoom: LiveRoom;
  posterFile: UploadFile;
  title: string;
  currentPoster: string;

  constructor(
    private sanitizer: DomSanitizer,
    private er: ElementRef,
    private userSerive: UserService,
    private commonService: CommonService,
    private notification: NzNotificationService,
    private liveService: LiveService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    const userInfoSub = this.userSerive.userInfo$.subscribe((userInfo: User) => {
      this.userInfo = userInfo;
      this.checkUserRole();
    });
    const liveRoomSub = this.liveService.liveRoom$.subscribe((liveRoom: LiveRoom) => {
      if (liveRoom) {
        this.title = '修改直播间';
        this.currentPoster = liveRoom.poster;
        this.liveRoom = liveRoom;
      } else {
        this.title = '开通直播间';
        this.liveRoom = new LiveRoom();
      }
    });
    const scopeInfoSub = this.commonService.getLiveScope().subscribe((res: ResponseData<any>) => {
      this.scopeIdData = {
        major: res.data.categoryIdData,
        class: res.data.classesIdData,
        student: res.data.userIdData
      };

      this.scopeNameData = {
        major: res.data.categoryNameData,
        class: res.data.classesNameData,
        student: res.data.userNameData
      };
    });

    this.subscription.add(userInfoSub);
    this.subscription.add(liveRoomSub);
    this.subscription.add(scopeInfoSub);
    this.liveTitleInputFocus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  posterBeforeUpload = (file: UploadFile): boolean => {
    this.posterFile = file;
    return false;
  }

  get posterLocalUrl(): string | SafeUrl {
    return this.posterFile
      ? this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.posterFile))
      : this.liveRoom.poster;
  }

  resetLiveForm(): void {
    this.liveRoom = new LiveRoom();
    this.posterFile = null;
    this.liveTitleInputFocus();
  }

  handleDeletePoster(): void {
    this.posterFile = null;
    this.currentPoster = null;
  }

  handleOperateLiveRoom(): void {
    const { id, title, banner, status } = this.liveRoom;
    const formData = new FormData();

    formData.append('title', title);
    formData.append('banner', banner);
    formData.append('poster', this.posterFile as any);
    formData.append('scope', this.selectedScope + '-' + this.selectedScopeId);

    if (id) {
      if (status === '3') {
        this.message.error('直播间已被冻结，无法修改直播间信息');
        return;
      }

      const messageId = this.message.loading('正在修改', { nzDuration: 0 }).messageId;

      formData.append('id', String(id));
      this.liveService.updateLiveRoom(formData).subscribe((res: ResponseData<any>) => {
        this.message.remove(messageId);
        if (res.code === SUCCESS_CODE) {
          if (status === '0' || status === '2') {
            this.message.success('修改成功，请等待管理员审核');
          } else {
            this.message.success('修改成功');
          }
          this.liveService.getLiveRoom();
          this.posterFile = null;
        }
      });
    } else {
      const messageId = this.message.loading('正在上传', { nzDuration: 0 }).messageId;

      this.liveService.createLiveRoom(formData).subscribe((res: ResponseData<any>) => {
        this.message.remove(messageId);
        if (res.code === SUCCESS_CODE) {
          this.message.success('申请成功，请等待管理员审核');
          this.liveService.getLiveRoom();
          this.posterFile = null;
        }
      });
    }
  }

  checkLiveRoomFormStatus(): boolean {
    const { id, title, banner } = this.liveRoom;

    return id ? Boolean(title && banner) : [title, banner, this.posterFile].every(item => !!item);
  }

  private checkUserRole(): void {
    if (this.userInfo.role !== this.roleType.teacher) {
      this.notification.warning('权限不足', '当前账号的角色不是教师，暂无开通直播权限');
    }
  }

  private liveTitleInputFocus(): void {
    const $liveLitle: HTMLElement = this.er.nativeElement.querySelector('#live_title');
    $liveLitle.focus();
  }

  provinceChange(value: string): void {
    this.selectedScope = this.scopeIdData[value][0];
  }
}
