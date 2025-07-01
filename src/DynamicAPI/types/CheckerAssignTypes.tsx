export interface Checker {
  id?: any;
  name: string;
}

export interface CheckerAssign {
  id?: any;
  checker_leader?: any;
  inbound_plan_id: string;
  checker_leader_id: string;
  checkers: Checker[];
  status: string;
  assign_date_start: string;
  assign_date_finish: string;
}

export type CreateCheckerAssign = Omit<CheckerAssign, "id">;
export type UpdateCheckerAssign = Partial<CreateCheckerAssign>;
