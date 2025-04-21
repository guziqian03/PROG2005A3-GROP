import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonGrid, 
  IonCol, 
  IonRow, 
  IonIcon, 
  IonButton, 
  IonFabButton, 
  IonFab, 
  IonButtons,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { ApiService } from '../../service/api.service';
import { addIcons } from 'ionicons';  // For registration icon
import { helpCircle, cube, business, create } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonButtons, 
    IonFab, 
    IonFabButton, 
    IonButton, 
    IonIcon, 
    IonRow, 
    IonCol, 
    IonGrid, 
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel,
    IonSelect,
    IonSelectOption
  ]
})
export class Tab1Page {
  items: any[] = []; // All data
  filteredItems: any[] = []; // Filtered data
  recommendedItems: any[] = []; // Recommended product data
  filterCondition: string = 'all'; // Filters
  searchTerm: string = ''; //Search Keywords

  // Filter options
  filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'low-stock', label: 'Low Stock' }
  ];

  constructor(private apiService: ApiService) {
    addIcons({cube,business,create,helpCircle}); // Registration help icon
  }


    // Randomly generate data
    generateRecommendedItems() {
    const randomRecommendedCount = Math.floor(Math.random() * 3) + 3; // Randomly generate 3 to 5 rows of recommended products
    const shuffledItems = [...this.items]; // Copying an array to avoid modifying the original
    this.recommendedItems = [];

    // Randomly select recommended products
    for (let i = 0; i < randomRecommendedCount; i++) {
      const randomIndex = Math.floor(Math.random() * shuffledItems.length);
      this.recommendedItems.push(shuffledItems[randomIndex]);
      shuffledItems.splice(randomIndex, 1); // Make sure you don’t repeat the selection
    }
  }


  ngOnInit() {
    this.loadItems();
  }

  // Loading data
  loadItems() {
    this.apiService.getAllItems().subscribe(
      (data) => {
        this.items = data;
        this.applyFilter(); // Apply filtering on initialization
        console.log('Items loaded:', this.items);
        this.generateRecommendedItems(); // Generate recommended products using test data
      },
      (error) => {
        console.error('Error fetching items:', error);
        // Temporarily add test data
        this.items = [
          {
            item_id: 1,
            item_name: '测试商品',
            category: '测试类别',
            price: 100,
            quantity: 10,
            special_note: '测试备注',
            supplier_name: '测试供应商',
            stock_status: '有货'
          }
        ];
        this.generateRecommendedItems(); // Generate recommended products using test data
        this.applyFilter(); // Apply filtering on initialization
      }
    );
  }

  // Apply filtering on initialization
  applyFilter() {
    let filtered = this.items;

    // Apply filters
    if (this.filterCondition === 'in-stock') {
      filtered = filtered.filter(item => item.quantity > 0);
    } else if (this.filterCondition === 'out-of-stock') {
      filtered = filtered.filter(item => item.quantity <= 0);
    } else if (this.filterCondition === 'low-stock') {
      filtered = filtered.filter(item => item.quantity > 0 && item.quantity < 5);
    }

    // Apply search criteria
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.item_name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    this.filteredItems = filtered;
  }

  // Handling filter changes
  onFilterChange(event: any) {
    this.filterCondition = event.detail.value;
    this.applyFilter();
  }

  // Processing Search
  searchItems(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.applyFilter();
  }


  showHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup1') as HTMLElement;
    if (helpPopup) {
      helpPopup.style.display = 'block';
    }
  }


  closeHelpPopup(): void {
    const helpPopup = document.getElementById('help-popup1') as HTMLElement;
    if (helpPopup) {
      helpPopup.style.display = 'none';
    }
  }
}