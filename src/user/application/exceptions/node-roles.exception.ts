export class NoRolesException extends Error {
  constructor() {
    super('User does not have any roles assigned');
  }
}
