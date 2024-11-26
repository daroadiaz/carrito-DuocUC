import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div 
        *ngFor="let notification of notifications"
        class="notification"
        [class.success]="notification.type === 'success'"
        [class.error]="notification.type === 'error'"
        [class.info]="notification.type === 'info'"
      >
        {{ notification.message }}
        <button 
          class="close-button"
          (click)="removeNotification(notification.id)"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .notification {
      padding: 12px 24px;
      border-radius: 4px;
      color: white;
      min-width: 300px;
      max-width: 400px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideIn 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .success {
      background-color: #2ecc71;
    }

    .error {
      background-color: #e74c3c;
    }

    .info {
      background-color: #3498db;
    }

    .close-button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0 0 0 12px;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(
      notifications => this.notifications = notifications
    );
  }

  removeNotification(id: string): void {
    this.notificationService.remove(id);
  }
}