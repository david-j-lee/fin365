/*
    This service handles all the calls to the WebAPI for budgets
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from '../../../../core/services/config.service';
import { BaseService } from '../../../../core/services/base.service';

import { BudgetAdd } from '../../interfaces/budgets/budget-add.interface';
import { BudgetEdit } from '../../interfaces/budgets/budget-edit.interface';

@Injectable()
export class WebApiBudgetService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll() {
    const url = `${this.baseUrl}/budgets/getall`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers });
  }

  add(value: BudgetAdd) {
    const url = this.baseUrl + '/budgets/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers });
  }

  update(value: BudgetEdit) {
    const url = this.baseUrl + '/budgets/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.put(url, body, { headers });
  }

  delete(id: number | string) {
    const url = `${this.baseUrl}/budgets/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers });
  }
}
