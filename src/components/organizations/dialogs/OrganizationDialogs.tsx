import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NewOrgDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newOrgName: string;
  onNewOrgNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function NewOrgDialog({ 
  open, 
  onOpenChange, 
  newOrgName, 
  onNewOrgNameChange, 
  onSubmit 
}: NewOrgDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Organization name"
            value={newOrgName}
            onChange={(e) => onNewOrgNameChange(e.target.value)}
          />
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteEmail: string;
  onInviteEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  inviteEmail,
  onInviteEmailChange,
  onSubmit
}: InviteMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            value={inviteEmail}
            onChange={(e) => onInviteEmailChange(e.target.value)}
          />
          <Button type="submit" className="w-full">Send Invitation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}