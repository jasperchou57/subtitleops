import { describe, expect, it } from 'vitest';
import { getTemplate } from './render';

describe('workspace invitation email', () => {
  it('renders the workspace, role, and invitation link', async () => {
    const invitationUrl =
      'https://subtitleops.com/dashboard/invite?token=test-token';
    const result = await getTemplate({
      template: 'workspaceInvitation',
      context: {
        url: invitationUrl,
        workspaceName: 'Caption Studio',
        role: 'reviewer',
      },
    });

    expect(result.subject).toBe('Join a SubtitleOps workspace');
    expect(result.html).toContain('Caption Studio');
    expect(result.html).toContain('reviewer');
    expect(result.html).toContain(invitationUrl.replace('&', '&amp;'));
    expect(result.text).toContain(
      'You have been invited to join Caption Studio as a reviewer.'
    );
  });
});
