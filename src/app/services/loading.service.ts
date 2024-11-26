import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private loadingStack: number = 0;

  show(): void {
    this.loadingStack++;
    if (this.loadingStack === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    if (this.loadingStack > 0) {
      this.loadingStack--;
      if (this.loadingStack === 0) {
        this.loadingSubject.next(false);
      }
    }
  }

  clear(): void {
    this.loadingStack = 0;
    this.loadingSubject.next(false);
  }

  // Utilidad para envolver promesas con loading automático
  async withLoading<T>(promise: Promise<T>): Promise<T> {
    try {
      this.show();
      return await promise;
    } finally {
      this.hide();
    }
  }
}