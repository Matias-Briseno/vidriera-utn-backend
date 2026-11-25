
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { UsersService } from "./users.service.js";

import { UpdateProfileDto } from "./dto/update-profile.dto.js";
import { CreateStudentDto } from "./dto/create-student.dto.js";
import { UpdateStudentDto } from "./dto/update-student.dto.js";
import { CreateStaffDto } from "./dto/create-staff.dto.js";
import { UpdateStaffDto } from "./dto/update-staff.dto.js";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";

import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interfaces.js";

import { ResetPasswordDto } from "./dto/reset-password.dto.js";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get("me")
  findMyProfile(
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.findMyProfile(user.id);
  }

  @Patch("me")
  updateMyProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateMyProfile(
      user.id,
      dto,
    );
  }



  @Get("students")
  @Roles("directivo", "docente", "bedelia")
  findStudents() {
    return this.usersService.findStudents();
  }

  @Get("students/:id")
  @Roles("directivo", "docente", "bedelia")
  findStudentById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.usersService.findStudentById(id);
  }

  @Post("students")
  @Roles("directivo", "docente", "bedelia")
  createStudent(
    @Body() dto: CreateStudentDto,
  ) {
    return this.usersService.createStudent(dto);
  }

  @Patch("students/:id")
  @Roles("directivo", "docente", "bedelia")
  updateStudent(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.usersService.updateStudent(id, dto);
  }

  @Delete("students/:id")
  @Roles("directivo", "docente", "bedelia")
  deleteStudent(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.usersService.deleteStudent(id);
  }



  @Get("staff")
  @Roles("directivo")
  findStaff() {
    return this.usersService.findStaff();
  }

  @Get("staff/:id")
  @Roles("directivo")
  findStaffById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.usersService.findStaffById(id);
  }

  @Post("staff")
  @Roles("directivo")
  createStaff(
    @Body() dto: CreateStaffDto,
  ) {
    return this.usersService.createStaff(dto);
  }

  @Patch("staff/:id")
  @Roles("directivo")
  updateStaff(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.usersService.updateStaff(id, dto);
  }

  @Delete("staff/:id")
  @Roles("directivo")
  deleteStaff(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.usersService.deleteStaff(id);
  }


  @Patch(":id/reset-password")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("directivo", "bedelia")
  async resetPassword(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.usersService.resetPassword(
      id,
      dto.newPassword,
      user.rol,
    );
  }

}
