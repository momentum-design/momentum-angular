import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, OnDestroy } from '@angular/core';
import { AlertMeetingConfig } from './alert-meeting-config';
import { AlertMeetingContainerComponent } from './alert-meeting-container.component';

@Injectable()
export class AlertMeetingService implements OnDestroy {
  private _overlayRef?: OverlayRef | null = null;
  private _alertContainerRef?: ComponentRef<AlertMeetingContainerComponent> | null = null;

  constructor(private _overlay: Overlay) {}

  show(config: AlertMeetingConfig): string {
    if (!this._overlayRef) {
      this._overlayRef = this._overlay.create();
    }
    const container = this._attachAlertContainer(this._overlayRef);
    const _config = {...new AlertMeetingConfig(), ...config};
    return container.addAlert(_config);
  }

  hide(key: string): void {
    if (this._alertContainerRef) {
      this._alertContainerRef.instance.removeAlert(key);
    }
  }

  private _attachAlertContainer(overlayRef: OverlayRef): AlertMeetingContainerComponent {
    if (this._alertContainerRef) {
      return this._alertContainerRef.instance;
    }

    const containerPortal = new ComponentPortal(AlertMeetingContainerComponent);
    this._alertContainerRef = overlayRef.attach(containerPortal);
    const onDestroySub = this._alertContainerRef.instance._onDestroy.subscribe(() => {
      onDestroySub.unsubscribe();
      this._dispose();
    });
    return this._alertContainerRef.instance;
  }

  ngOnDestroy() {
    if (this._alertContainerRef) {
      this._alertContainerRef.instance.destroy();
    }
  }

  private _dispose(): void {
    this._alertContainerRef = null;
    this._overlayRef.dispose();
    this._overlayRef = null;
  }
}
