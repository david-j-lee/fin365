/*
 * Import just the rxjs statics and operators we need for THIS app.
 * See node_module/rxjs/Rxjs.js
 */
// Statics
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/throw'
// Operators
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/toPromise'
