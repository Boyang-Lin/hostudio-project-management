export interface Organization {
  id: string;
  name: string;
  created_at: string;
}

export interface Member {
  user_id: string;
  role: string;
  profile_username: string;
}

export interface OrganizationMember {
  user_id: string;
  role: string;
  profiles?: {
    username: string | null;
  } | null;
}