/*
    This service handles all the calls to the WebAPI for expenses
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from '../../../../core/services/config.service';
import { BaseService } from '../../../../core/services/base.service';

import { ExpenseAdd } from '../../interfaces/expenses/expense-add.interface';
import { ExpenseEdit } from '../../interfaces/expenses/expense-edit.interface';

@Injectable()
export class WebApiExpenseService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll(budgetId: number | string) {
    const url = `${this.baseUrl}/expenses/getall?budgetId=${budgetId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers });
  }

  add(value: ExpenseAdd) {
    const url = this.baseUrl + '/expenses/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers });
  }

  update(value: ExpenseEdit) {
    const url = this.baseUrl + '/expenses/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.put(url, body, { headers });
  }

  delete(id: number | string) {
    const url = `${this.baseUrl}/expenses/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers });
  }
}
