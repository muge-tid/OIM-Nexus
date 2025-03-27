import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerTileComponent } from './manager-tile.component';

describe('ManagerTileComponent', () => {
  let component: ManagerTileComponent;
  let fixture: ComponentFixture<ManagerTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
