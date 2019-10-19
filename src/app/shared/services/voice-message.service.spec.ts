import { TestBed } from '@angular/core/testing';

import { VoiceMessageServiceService } from './voice-message.service';

describe('VoiceMessageServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoiceMessageServiceService = TestBed.get(VoiceMessageServiceService);
    expect(service).toBeTruthy();
  });
});
