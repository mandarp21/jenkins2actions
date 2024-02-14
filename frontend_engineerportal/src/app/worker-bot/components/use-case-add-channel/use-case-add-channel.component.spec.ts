import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UseCaseChannelComponent } from './use-case-add-channel.component';
import { TestBed} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';


// let comp : CreateComponent;
// const fixture = TestBed.createComponent(CreateComponent);

@Component({
	selector: 'converse-drop-down',
	template: '',
})
class MockDropDownComponent {
  @Input() icondisplay
  @Input() inwidth
  @Input() inleft
  @Input() data
  @Input() showtitle
  @Input() placeholder
}

@Component({
	selector: 'tag-input',
	template: '',
})
class MockTagInputComponent {
  @Input() maxItems
  @Input() hideForm
  @Input() modelAsStrings
}

describe('Use case add channel Component', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, FormsModule],
			declarations: [UseCaseChannelComponent,
        MockDropDownComponent,
        MockTagInputComponent
			]
		}).compileComponents()
	});

  it('should and channels and emit them on click of add buttons', () => {
		const fixture = TestBed.createComponent(UseCaseChannelComponent);
    const comp = fixture.componentInstance;
    comp.channels = ['Web', 'SMS']
    const channelToAdd = { value: 'Email', key: 'Email' };
    spyOn(comp.addChannelEmitter, 'emit').and.callThrough();
    comp.addChannel(channelToAdd);
    expect(comp.addChannelEmitter.emit).toHaveBeenCalledWith(['Web', 'SMS', 'Email']);
	});

  it('should emit channels excluding removed channel on click of remove button', () => {
		const fixture = TestBed.createComponent(UseCaseChannelComponent);
    const comp = fixture.componentInstance;
    comp.channels = ['Web', 'SMS'];
    spyOn(comp.addChannelEmitter, 'emit').and.callThrough();
    comp.removeChannel('Email');
    expect(comp.addChannelEmitter.emit).toHaveBeenCalledWith(['Web', 'SMS']);
  });
})
