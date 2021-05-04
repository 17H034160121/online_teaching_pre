import { Component } from '@angular/core';
import Classes from 'class/classes';
import { ClassService } from 'services/class.service';
import { BehaviorSubject } from 'rxjs';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-admin-class-manage',
  templateUrl: './class-manage.component.html',
  styleUrls: ['./class-manage.component.scss']
})
export class ClassManageComponent {
  modalType = {
    addClass: 'ADD_CATEGORY',
    editClass: 'EDIT_CATEGORY'
  };

  modalStatus = false;
  modalTitle: string;
  className: string;
  categoryId: number;
  currenClassId: number;
  currentModalType: string;

  constructor(private classService: ClassService, private message: NzMessageService) {}

  get classList$(): BehaviorSubject<Classes[]> {
    return this.classService.classList$;
  }

  toggleModal(type?: string, classes?: Classes): void {
    if (type) {
      let title: string;
      switch (type) {
        case this.modalType.addClass:
          title = '添加班级';
          this.className = '';
          break;
        case this.modalType.editClass:
          title = '编辑班级';
          this.className = classes.name;
          this.currenClassId = classes.id;
          break;
      }
      this.modalTitle = title;
      this.currentModalType = type;
    }
    this.modalStatus = !this.modalStatus;
  }

  handleOperateClass(): void {
    switch (this.currentModalType) {
      case this.modalType.addClass:
        this.handleAddClass();
        break;
      case this.modalType.editClass:
        this.handleEditClass();
        break;
    }
  }

  handleAddClass(): void {
    const classes = new Classes();
    classes.name = this.className;
    classes.categoryId = this.categoryId;

    this.classService.addClass(classes).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('添加成功');
        this.className = '';
        this.toggleModal();
        this.classService.getClassList();
      }
    });
  }

  handleEditClass(): void {
    const classes = new Classes();
    classes.name = this.className;

    this.classService
      .updateClass(this.currenClassId, classes)
      .subscribe((res: ResponseData<any>) => {
        if (res.code === SUCCESS_CODE) {
          this.message.success('编辑成功');
          this.className = '';
          this.toggleModal();
          this.classService.getClassList();
        }
      });
  }

  handleDeleteClass(id: number): void {
    this.classService.deleteClass(id).subscribe((res: ResponseData<any>) => {
      if (res.code === SUCCESS_CODE) {
        this.message.success('删除成功');
        this.classService.getClassList();
      }
    });
  }
}
