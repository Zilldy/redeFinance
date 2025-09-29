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
  paginatedCompanies: Company[] | undefined = [];
  pageSize = 6;
  constructor(private router: Router){}

  ngOnChanges() {
    this.allCompanies = this.data ?? [];
    this.updatePage(this.allCompanies);
    this.paginator?.page.subscribe(() => this.updatePage(this.allCompanies));
  }

  ngAfterViewInit() {
    this.updatePage(this.allCompanies);
    this.paginator?.page.subscribe(() => this.updatePage(this.allCompanies));
  }

  updatePage(allCompanies: Company[] | null) {  
    const startIndex = this.paginator?.pageIndex * this.paginator?.pageSize;
    const endIndex = startIndex + this.paginator?.pageSize;
    this.paginatedCompanies = allCompanies?.slice(startIndex, endIndex);
  }

  goToDetail(company: any) {
    if (company.classificacao === 'Não Classificado') {
      return; // não redireciona
    }
    this.router.navigate(['/empresa', company.cnpj]);
  }

  filterByName(name: string) {
    if(name === ''){
      this.updatePage(this.allCompanies);
      return;
    }else{
      var companies = this.allCompanies;
      const found = companies?.filter(company => company.nome.toLowerCase().includes(name.toLowerCase()));
      if (found) {
        this.updatePage(found);
      }else{
        console.log("DEU BOM NÃO");
      }
    }
  }

  onSelectChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filterByClassification(value);
  }

  filterByClassification(classification: string) {
    if(classification === ''){
      this.updatePage(this.allCompanies);
      return;
    }else{
      var companies = this.allCompanies;
      const found = companies?.filter(company => company.classificacao === classification);
      this.updatePage(found || []);
    }
  }
}
