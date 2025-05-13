import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

export interface Repo {
  id?: number;
  name: string;
  url?: string;       
  urlSite?: string;    
  description?: string;
  created_at?: string;
  updated_at?: string;
  topics?: string[];
  languages: string[];
  readmeUrl?: string;
}
@Injectable({ providedIn: 'root' })
export class GithubService {
  private apiUrl = 'https://api.github.com/users';
  private username = 'AdrianS2002';

  constructor(private http: HttpClient) {}

 
  getReposWithLanguages(): Observable<Repo[]> {
    const params = new HttpParams()
      .set('sort', 'created')
      .set('direction', 'desc')
      .set('per_page', '30');

    return this.http
      .get<Repo[]>(`${this.apiUrl}/${this.username}/repos`, { params })
      .pipe(
        mergeMap(repos =>
          forkJoin(
            repos.map(repo =>
              this.http
                .get<Record<string, number>>(
                  `https://api.github.com/repos/${this.username}/${repo.name}/languages`
                )
                .pipe(
                  map(langObj => ({
                    ...repo,
                    languages: Object.keys(langObj) 
                  }))
                )
            )
          )
        ),
       catchError(err => {
          console.warn('GitHub API failed, loading fallback projects', err);
          return this.http.get<Repo[]>('myProjects.json');
        })
      );
  }

   getReadmeRawUrl(repoName: string): string {
    return `https://raw.githubusercontent.com/${this.username}/${repoName}/main/README.md`;
  }
}
