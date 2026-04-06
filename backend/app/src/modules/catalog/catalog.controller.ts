import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { CurrentUser } from "../identity/decorators/current-user.decorator";
import { Public } from "../identity/decorators/public.decorator";

import { CatalogService } from "./catalog.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { CreateServiceDto } from "./dto/create-service.dto";
import { CreateSpecialtyDto } from "./dto/create-specialty.dto";
import { ListCatalogQueryDto, ListCatalogServicesQueryDto } from "./dto/list-catalog.query.dto";
import { PatchCityDto } from "./dto/patch-city.dto";
import { PatchServiceDto } from "./dto/patch-service.dto";
import { PatchSpecialtyDto } from "./dto/patch-specialty.dto";

import type { AuthUser } from "../../common/types/auth-user.type";

@ApiTags("Catalog")
@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Public()
  @ApiOperation({ summary: "List active specialties" })
  @ApiOkResponse({ description: "Catalog specialties list" })
  @Get("specialties")
  listSpecialties(@Query() query: ListCatalogQueryDto, @CurrentUser() user?: AuthUser) {
    return this.catalogService.listSpecialties(query, user);
  }

  @Public()
  @ApiOperation({ summary: "List active services" })
  @ApiOkResponse({ description: "Catalog services list" })
  @Get("services")
  listServices(@Query() query: ListCatalogServicesQueryDto, @CurrentUser() user?: AuthUser) {
    return this.catalogService.listServices(query, user);
  }

  @Public()
  @ApiOperation({ summary: "List active cities" })
  @ApiOkResponse({ description: "Catalog cities list" })
  @Get("cities")
  listCities(@Query() query: ListCatalogQueryDto, @CurrentUser() user?: AuthUser) {
    return this.catalogService.listCities(query, user);
  }

  @Public()
  @ApiOperation({ summary: "List active services for a specialty" })
  @ApiParam({ name: "specialtyId" })
  @ApiOkResponse({ description: "Catalog services by specialty" })
  @Get("specialties/:specialtyId/services")
  listServicesBySpecialty(
    @Param("specialtyId") specialtyId: string,
    @Query() query: ListCatalogQueryDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.catalogService.listServicesBySpecialty(specialtyId, query, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create specialty (platform admin)" })
  @ApiOkResponse({ description: "Specialty created" })
  @Post("specialties")
  createSpecialty(@CurrentUser() user: AuthUser, @Body() payload: CreateSpecialtyDto) {
    return this.catalogService.createSpecialty(user, payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Patch specialty (platform admin)" })
  @ApiParam({ name: "specialtyId" })
  @ApiOkResponse({ description: "Specialty updated" })
  @Patch("specialties/:specialtyId")
  patchSpecialty(
    @CurrentUser() user: AuthUser,
    @Param("specialtyId") specialtyId: string,
    @Body() payload: PatchSpecialtyDto,
  ) {
    return this.catalogService.patchSpecialty(user, specialtyId, payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create service (platform admin or organization proposal)" })
  @ApiOkResponse({ description: "Service created" })
  @Post("services")
  createService(
    @CurrentUser() user: AuthUser,
    @Body() payload: CreateServiceDto,
    @Headers("x-organization-id") organizationId?: string,
  ) {
    return this.catalogService.createService(user, payload, organizationId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Patch service (platform admin)" })
  @ApiParam({ name: "serviceId" })
  @ApiOkResponse({ description: "Service updated" })
  @Patch("services/:serviceId")
  patchService(
    @CurrentUser() user: AuthUser,
    @Param("serviceId") serviceId: string,
    @Body() payload: PatchServiceDto,
  ) {
    return this.catalogService.patchService(user, serviceId, payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Create city (platform admin or organization proposal)" })
  @ApiOkResponse({ description: "City created" })
  @Post("cities")
  createCity(
    @CurrentUser() user: AuthUser,
    @Body() payload: CreateCityDto,
    @Headers("x-organization-id") organizationId?: string,
  ) {
    return this.catalogService.createCity(user, payload, organizationId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Patch city (platform admin)" })
  @ApiParam({ name: "cityCode" })
  @ApiOkResponse({ description: "City updated" })
  @Patch("cities/:cityCode")
  patchCity(
    @CurrentUser() user: AuthUser,
    @Param("cityCode") cityCode: string,
    @Body() payload: PatchCityDto,
  ) {
    return this.catalogService.patchCity(user, cityCode, payload);
  }
}
