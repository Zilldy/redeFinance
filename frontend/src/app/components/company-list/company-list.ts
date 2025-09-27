import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Company } from '../../models/company.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule,MatPaginatorModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss']
})
export class CompanyListComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() data: Company[] = [];
  allCompanies: Company[]= [];
  paginatedCompanies: any[] = [];
  pageSize = 6;

  ngOnInit(){
    this.allCompanies = this.data;
  }

  ngAfterViewInit() {
    this.updatePage();
    this.paginator.page.subscribe(() => this.updatePage());
  }

  updatePage() {  
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.paginatedCompanies = this.allCompanies.slice(startIndex, endIndex);
  }
}
