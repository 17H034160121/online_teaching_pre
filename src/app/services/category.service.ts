import { Injectable } from '@angular/core';
import Category from 'class/category';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ResponseData, SUCCESS_CODE } from 'config/http-config';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  categoryList$: BehaviorSubject<Category[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
    this.getCategoryList();
  }

  /**
   * @description 获取院系列表
   */
  getCategoryList(): void {
    this.http.get('/category/list').subscribe((res: ResponseData<Category[]>) => {
      if (res.code === SUCCESS_CODE) {
        this.categoryList$.next(res.data);
      }
    });
  }

  /**
   * @description 添加院系
   */
  addCategory(params: Category): Observable<any> {
    return this.http.post('/admin/category', params);
  }

  /**
   * @description 删除院系
   */
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`/admin/category/${id}`);
  }

  /**
   * @description 更新院系
   */
  updateCategory(id: number, params: Category): Observable<any> {
    return this.http.patch(`/admin/category/${id}`, params);
  }
}
