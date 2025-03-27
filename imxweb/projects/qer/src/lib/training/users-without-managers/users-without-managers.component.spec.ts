import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersWithoutManagersComponent } from './users-without-managers.component';

describe('UsersWithoutManagersComponent', () => {
  let component: UsersWithoutManagersComponent;
  let fixture: ComponentFixture<UsersWithoutManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersWithoutManagersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersWithoutManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
