// branch.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
// import { environments } from '../../../environments/environments.prod';
import { environments } from '../../../environments/environments';
// import { IDataService } from 'src/app/shared/components/ao-grid/types/types';
// import { DateIncidents } from '../models/activity.model';
// import { QueryFilter } from '../interfaces/queryfilter.interface';
import { QueryFilter } from '../interfaces/queryfilter.interface';

interface IDataService {
    findAll(controller: string, filters: QueryFilter): Observable<any>;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService<T> implements IDataService {
    // private readonly apiUrl = environment.apiUrl; // Ajusta esta URL a la de tu backend
    private readonly apiUrl = environments.baseURL; // Ajusta esta URL a la de tu backend

    constructor(private http: HttpClient) { }

    fetchData(controller:string,skip: number, limit: number, filters: string, relations?: string): Observable<any> {
        let params = new HttpParams();
        if (skip != null) params = params.set('skip', skip.toString());
        if (limit != null) params = params.set('limit', limit.toString());
        if (filters != null) params = params.set('filters', filters);
        if (relations != null) params = params.set('relations', relations.toString());

        return this.http.get<T[]>(`${this.apiUrl}${controller}?${params}`);
    }

    create(controller:string,dto: T): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}${controller}`, dto);
    }

    update(controller:string,id: string, dto: T): Observable<T> {
        return this.http.patch<T>(`${this.apiUrl}${controller}/${id}`, dto);
    }

    findOne(controller:string,id: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}${controller}/${id}`);
    }
    delete(controller:string,id: string): Observable<any> {
        return this.http.delete<T>(`${this.apiUrl}${controller}/${id}`);
    }

    addFile(file: File, fileName: string, fileType: string): Observable<any> {
        const formData = new FormData();
        formData.append(fileType, file, fileName);
        return this.http.post<any>(`https://apitest.adroitoverseas.net/api/Containers/uploads.adroitoverseas.net/upload`, formData); // Ajusta la ruta de carga de archivos según tu API
    }

    /* getLog(entityName:string,entityId: number,relations?:string): Observable<DateIncidents[]> {
        let params = new HttpParams();
        if (entityName != null) params = params.set('entityName', entityName);
        if (entityId != null) params = params.set('entityId', entityId.toString());
        if (relations != null) params = params.set('relations', relations);
        return this.http.get<DateIncidents[]>(`${this.apiUrl}http-log/?${params}`);
    } */
    findAll(controller: string, queryFilter: QueryFilter): Observable<any> {
        let params = new HttpParams();

        // Codifica el objeto QueryFilter como un string JSON
        const filterJson = JSON.stringify(queryFilter);
        params = params.set('filters', filterJson);

        return this.http.get<T[]>(`${this.apiUrl}${controller}?${params}`);
    }
    callPostApi(url:string,params?:HttpParams,data?:any):Observable<any>{
        return this.http.post<T[]>(`${this.apiUrl}${url}?${params}`,data);
    }
    callGetApi(url:string,params?:HttpParams):Observable<any>{
        return this.http.get<T[]>(`${this.apiUrl}${url}?${params}`);
    }
    callGetApiWOP(url:string):Observable<any>{
        return this.http.get<T[]>(`${this.apiUrl}${url}`);
    }
}
