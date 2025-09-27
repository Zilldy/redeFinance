import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, LineElement, CategoryScale, LinearScale, PointElement, PieController, BarController } from 'chart.js';

// registra tudo que pode ser usado
ChartJS.register(
  ArcElement,     // pie/doughnut
  BarElement,     // bar charts
  LineElement,    // line charts
  CategoryScale,  // eixo X (categorias)
  LinearScale,    // eixo Y (números)
  PointElement,   // pontos (line chart)
  Tooltip,
  Legend,
  Title,
  PieController,
  BarController  
);