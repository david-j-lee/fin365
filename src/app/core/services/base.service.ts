import { Observable, throwError } from 'rxjs';

export abstract class BaseService {
  constructor() {}

  protected handleError(res: any) {
    const applicationError = res.headers.get('Application-Error');

    // either applicationError in header or model error in body
    if (applicationError) {
      return throwError(applicationError);
    }

    let modelStateErrors: string | null = '';
    const serverError = res.error;

    if (!serverError.type) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return throwError(modelStateErrors || 'Server error');
  }
}
