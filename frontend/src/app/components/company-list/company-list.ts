import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../models/company.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule,MatPaginatorModule, MatTooltipModule, MatIconModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss']
})
export class CompanyListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() data: Company[] | null = [];
  allCompanies: Company[] | null = [];
  filteredCompanies: Company[] | null = [];
  paginatedCompanies: Company[] | undefined = [];
  pageSize = 6;
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private router: Router){}

  ngOnChanges() {
    this.allCompanies = this.data ?? [];
    this.filteredCompanies = this.allCompanies;
    this.resetPagination();
  }

  ngAfterViewInit() {
    this.updatePage();
    this.paginator?.page.subscribe(() => this.updatePage());
  }

  resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.updatePage();
  }

  updatePage() {  
    const startIndex = (this.paginator?.pageIndex || 0) * (this.paginator?.pageSize || this.pageSize);
    const endIndex = startIndex + (this.paginator?.pageSize || this.pageSize);
    this.paginatedCompanies = this.filteredCompanies?.slice(startIndex, endIndex);
  }

  goToDetail(company: any) {
    if (company.classificacao === 'Não Classificado') {
      return; // não redireciona
    }
    this.router.navigate(['/empresa', company.cnpj]);
  }

  filterByName(name: string) {
    if(name === ''){
      this.filteredCompanies = this.allCompanies;
    }else{
      const found = this.allCompanies?.filter(company => 
        company.nome.toLowerCase().includes(name.toLowerCase())
      );
      this.filteredCompanies = found || [];
    }
    this.resetPagination();
  }

  onSelectChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterByClassification(value);
  }

  filterByClassification(classification: string) {
    if(classification === ''){
      this.filteredCompanies = this.allCompanies;
    }else{
      const found = this.allCompanies?.filter(company => 
        company.classificacao === classification
      );
      this.filteredCompanies = found || [];
    }
    this.resetPagination();
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }
}
