import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

// Third-party
import { of, Subject, switchMap, takeUntil } from 'rxjs';

// Local
import { SprintSettingsService } from 'src/app/settings/services/sprint-settings.service';
import { SprintSetting } from 'src/app/settings/interfaces/sprint-setting';


@Component({
  selector: 'app-sprint-settings-detail',
  templateUrl: './sprint-settings-detail.component.html',
  styleUrls: ['./sprint-settings-detail.component.scss']
})
export class SprintSettingsDetailComponent implements OnInit, OnDestroy {

  icon: string;
  form: FormGroup;

  private _isDestroyed$: Subject<void>;
  private _createOrUpdateSubscription$: Subject<void>;

  constructor(
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _formBuilder: FormBuilder,
    private _iconRegistry: MatIconRegistry,
    private _activatedRoute: ActivatedRoute,
    private _sprintSettingsService: SprintSettingsService
  ) {
    this.form = this._formBuilder.group({
      id: [],
      name: [null, [Validators.required]],
      burdownMax: [null, [Validators.required]],
      escapedDefectsMax: [null, [Validators.required]],
      feedbackMax: [null, [Validators.required]],
    });

    this.icon = 'add';
    this._sanitizeIcons();
    this._isDestroyed$ = new Subject();
    this._createOrUpdateSubscription$ = new Subject();
  }

  private _sanitizeIcons(): void {
    this._iconRegistry.addSvgIcon('add', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add.svg'));
    this._iconRegistry.addSvgIcon('edit', this._sanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg'));
  }

  onSubmit(): void {
    if (this.form.valid) {
      let obj: SprintSetting = this.form.value;
      let update: boolean;

      update = !!(obj.id);

      of(undefined).pipe(
        takeUntil(
          this._createOrUpdateSubscription$
        ),
        switchMap(() => {

          if (update) return this._sprintSettingsService.patchSprintSetting(obj.id, obj);
          return this._sprintSettingsService.postSprintSetting(obj);
        })
      ).subscribe({
        next: (value) => {
          if (update) return;
          this._router.navigate(['settings','sprint-settings', value.id]);
        },
        error: (error: HttpErrorResponse) => { }
      });
    }
  }

  ngOnInit(): void {
    this._activatedRoute.params.pipe(
      takeUntil(this._isDestroyed$),
      switchMap((params: any) => {
        if (params.id) return this._sprintSettingsService.getSprintSetting(params.id);
        return of();
      })
    ).subscribe({
      next: (value) => {
        if (value) {
          this.icon = 'edit';
          this.form.patchValue(value);
        }
      },
      error: (error) => console.log(error)
    });
  }


  ngOnDestroy(): void {
    this._isDestroyed$.next();
    this._isDestroyed$.complete();
    this._createOrUpdateSubscription$.next();
    this._createOrUpdateSubscription$.complete();
  }
}