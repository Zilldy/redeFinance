import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss']
})
export class CompanyListComponent {
  companies = [
    {
      nome: "CNPJ_00001",
      cnpj: "45.543.915/0001-81",
      classificacao: "Início",
      cnae: "Extração de minério de ferro"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
    {
      nome: "CNPJ_00002",
      cnpj: "14.947.431/0001-74",
      classificacao: "Madura",
      cnae: "Fabricação de produtos químicos"
    },
  ];
}
