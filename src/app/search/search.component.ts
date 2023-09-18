import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  authors: any[] = [];
  currentPage: number = 1;
  totalItems: number = 0;

  selectedAuthor: any; // Biến để lưu trữ thông tin nhà văn được chọn
  modalVisible = false; // Biến để kiểm soát hiển thị modal
  loading: boolean = false; //Biến để kiểm soát việc hiển thị spinning load

  constructor( private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.searchQuery = '';
    this.authors = [];
    this.currentPage = 1;
    this.totalItems = 0;

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      const page = +params['page'] || 1; // Lấy thông tin về trang hiện tại từ tham số 'page'
  
      if (this.searchQuery) {
        this.search(page); // Thực hiện tìm kiếm với trang hiện tại
      }
    });
  }

  search(page: number) {
    this.loading = true; // Bắt đầu tải dữ liệu
    this.currentPage = page; 
    this.fetchAuthors();

    // Sau khi cập nhật kết quả, cập nhật page hiện tại vào URL
    this.router.navigate([], {
      queryParams: { q: this.searchQuery, page: page },
      queryParamsHandling: 'merge',
      replaceUrl: true // Thêm cờ replaceUrl để thay thế URL hiện tại thay vì thêm vào lịch sử trình duyệt
    });
  }

  fetchAuthors() {
    const apiUrl = `https://openlibrary.org/search/authors.json?q=${this.searchQuery}&limit=10&offset=${(this.currentPage - 1) * 10}`;

    this.http.get(apiUrl).subscribe((response: any) => {
      this.authors = response.docs;
      this.totalItems = response.numFound;
      this.loading = false; // Kết thúc tải dữ liệu
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchAuthors();

    this.router.navigate([], {
      queryParams: { q: this.searchQuery, page: page },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  //Xem chi tiết nhà văn qua popup
  openModal(key: string) {
    this.fetchAuthorDetails(key); // Gọi hàm để tải thông tin chi tiết từ API
    this.modalVisible = true; // Hiển thị modal
  }
  
  closeModal() {
    this.modalVisible = false; // Đóng modal
  }
  
  fetchAuthorDetails(key: string) {
    const url = `https://openlibrary.org/authors/${key}.json`;
    this.http.get(url).subscribe((response: any) => {
      this.selectedAuthor = response; // Lưu thông tin nhà văn được chọn
    });
  }

  //Chuyển trang để xem tác phẩm của nhà văn
  seeWorks(authorKey: string) {
    this.router.navigate(['/author', authorKey, 'works'], { queryParams: { q: this.searchQuery, page: this.currentPage } });
  }
}
