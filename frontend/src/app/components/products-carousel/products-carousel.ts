import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ReplyProduct {
  product: string;
  why: string;
  approved?: boolean;
}

@Component({
  selector: 'app-products-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-carousel.html',
  styleUrls: ['./products-carousel.scss']
})
export class ProductsCarouselComponent implements OnInit {
  @Input() companyDetail: any;
  replyProducts: ReplyProduct[] = [];
  currentIndex = 0;
  showModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

    this.replyProducts = [
        {
            "product": "Crédito para Capital de Giro",
            "why": "Empresa em fase de início com alto potencial de crescimento. O crédito pode impulsionar a produção, otimizar o fluxo de caixa e aumentar significativamente os saldos, acelerando a expansão."
        },
        {
            "product": "Financiamento de Ativos Fixos",
            "why": "Com o setor de mineração em crescimento, o financiamento de equipamentos e infraestrutura pode aumentar a capacidade produtiva e a lucratividade média, garantindo um diferencial competitivo."
        },
        {
            "product": "Linha de Crédito para Comércio Exterior",
            "why": "O setor de mineração tem grande potencial de exportação. Essa linha de crédito pode facilitar as negociações internacionais, aumentando o volume de transações e, consequentemente, os lucros."
        }
    ]

    // if (this.companyDetail) {
    //   this.http.post<{ ReplyProducts: ReplyProduct[] }>(
    //     'http://localhost:8000/api/chat',
    //     {json_object: this.companyDetail}
    //   ).subscribe({
    //     next: (res) => this.replyProducts = res.ReplyProducts || [],
    //     error: (err) => console.error('Erro ao buscar produtos:', err)
    //   });
    // }
  }

  openProductInfo(): void {
    this.showModal = true;
  }

  closeProductInfo(): void {
    this.showModal = false;
  }

  approveProduct(): void {
    if (this.replyProducts[this.currentIndex]) {
      this.replyProducts[this.currentIndex].approved = true;
    }
  }

  rejectProduct(): void {
    // Remove o produto do array diretamente
    this.replyProducts.splice(this.currentIndex, 1);
    
    // Ajusta o índice se necessário
    if (this.currentIndex >= this.replyProducts.length && this.replyProducts.length > 0) {
      this.currentIndex = this.replyProducts.length - 1;
    } else if (this.replyProducts.length === 0) {
      this.currentIndex = 0;
    }
  }

  next(): void {
    if (this.replyProducts.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.replyProducts.length;
    }
  }

  prev(): void {
    if (this.replyProducts.length > 0) {
      this.currentIndex =
        (this.currentIndex - 1 + this.replyProducts.length) % this.replyProducts.length;
    }
  }
}
