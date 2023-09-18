import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
  authorKey: string = ' ';
  works: any[] = [];

  selectedWork: any;
  isModalOpen: boolean = false;

  loading: boolean = true; //Biến để kiểm soát việc hiển thị spinning load

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.authorKey = this.route.snapshot.paramMap.get('authorKey')!;
    this.getAuthorWorks();
  }

  getAuthorWorks() {
    const url = `https://openlibrary.org/authors/${this.authorKey}/works.json`;
    this.http.get<any[]>(url).subscribe((data: any) => {
      // Kiểm tra dữ liệu trả về từ API
      if (data && Array.isArray(data.entries)) {
        this.works = data.entries;
        this.loading = false; // Kết thúc tải dữ liệu
      } else {
        // Xử lý trường hợp dữ liệu không hợp lệ
      }
    });
  }

  // Xử lý hiện modal
  openModal(work: any) {
    this.selectedWork = work;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  goBack() {
    const queryParams = { q: this.route.snapshot.queryParams['q'], page: this.route.snapshot.queryParams['page'] };
    this.router.navigate(['/authors'], { queryParams });
  }
}
