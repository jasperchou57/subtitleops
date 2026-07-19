import { Text } from '@react-email/components';
import { m } from '@/locale/paraglide/messages';
import EmailButton from '../components/email-button';
import EmailLayout from '../components/email-layout';

const en = { locale: 'en' as const };

interface WorkspaceInvitationProps {
  url: string;
  workspaceName: string;
  role: string;
}

export default function WorkspaceInvitation({
  url,
  workspaceName,
  role,
}: WorkspaceInvitationProps) {
  return (
    <EmailLayout>
      <Text>{m.mail_workspace_invitation_greeting(undefined, en)}</Text>
      <Text>
        {m.mail_workspace_invitation_body({ workspaceName, role }, en)}
      </Text>
      <EmailButton href={url}>
        {m.mail_workspace_invitation_button(undefined, en)}
      </EmailButton>
      <Text>{m.mail_workspace_invitation_security(undefined, en)}</Text>
    </EmailLayout>
  );
}
