import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  success(message: string, duration: number = 3000): void {
    this.show({
      id: Date.now().toString(),
      message,
      type: 'success',
      duration
    });
  }

  error(message: string, duration: number = 5000): void {
    this.show({
      id: Date.now().toString(),
      message,
      type: 'error',
      duration
    });
  }

  info(message: string, duration: number = 4000): void {
    this.show({
      id: Date.now().toString(),
      message,
      type: 'info',
      duration
    });
  }

  private show(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    if (notification.duration) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }
  }

  remove(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter(n => n.id !== id)
    );
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }
}