import { Injectable } from '@angular/core';
import Classes from 'class/classes';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Injectable({ providedIn: 'root' })
export class ClassService {
  classList$: BehaviorSubject<Classes[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
    this.getClassList();
  }

  /**
   * @description 获取班级列表
   */
  getClassList(): void {
    this.http.get('/classes/list').subscribe((res: ResponseData<Classes[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.classList$.next(res.data);
      }
    });
  }

  /**
   * @description 添加班级
   */
  addClass(params: Classes): Observable<any> {
    return this.http.post('/admin/classes', params);
  }

  /**
   * @description 删除班级
   */
  deleteClass(id: number): Observable<any> {
    return this.http.delete(`/admin/classes/${id}`);
  }

  /**
   * @description 更新班级
   */
  updateClass(id: number, params: Classes): Observable<any> {
    return this.http.patch(`/admin/classes/${id}`, params);
  }
}
