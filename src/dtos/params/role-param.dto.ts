import { IsNotEmpty, IsString, Matches } from "class-validator"
import { Expose } from "class-transformer"

export class RoleParamDTO {
  @Expose()
  @IsNotEmpty({ message: "Role is required" })
  @IsString({ message: "Role must be a string" })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: "Role can only contain letters, numbers, underscores and hyphens",
  })
  role: string
}

