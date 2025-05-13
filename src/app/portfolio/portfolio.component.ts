import { Component, OnInit } from '@angular/core';
import { GithubService, Repo } from '../github.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  standalone: true,
  imports: [ NgFor, NgIf, CommonModule ]
})
export class PortfolioComponent implements OnInit {
  repos: Repo[] = [];

  constructor(private github: GithubService) {}

  ngOnInit(): void {
    this.github
      .getReposWithLanguages()
      .subscribe((repos: Repo[]) => (this.repos = repos));
  }
}
