/*
    This service handles all the calls to the WebAPI for revenues
*/

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from '../../../../core/services/config.service';
import { BaseService } from '../../../../core/services/base.service';

import { RevenueAdd } from '../../interfaces/revenues/revenue-add.interface';
import { RevenueEdit } from '../../interfaces/revenues/revenue-edit.interface';

@Injectable()
export class WebApiRevenueService extends BaseService {
  private baseUrl = '';

  constructor(private http: HttpClient, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }

  getAll(budgetId: number | string) {
    const url = `${this.baseUrl}/revenues/getall?budgetId=${budgetId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers });
  }

  add(value: RevenueAdd) {
    const url = this.baseUrl + '/revenues/add';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.post(url, body, { headers });
  }

  update(value: RevenueEdit) {
    const url = this.baseUrl + '/revenues/edit';
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify(value);
    return this.http.put(url, body, { headers });
  }

  delete(id: number | string) {
    const url = `${this.baseUrl}/revenues/delete?id=${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.delete(url, { headers });
  }
}
