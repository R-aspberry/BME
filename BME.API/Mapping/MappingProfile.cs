using AutoMapper;
using BME.API.DTOs;
using BME.API.Models;

namespace BME.API.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Project, ProjectDto>().ReverseMap();
        CreateMap<Employee, EmployeeDto>().ReverseMap();
        CreateMap<Department, DepartmentDto>().ReverseMap();
        CreateMap<OSE, OSEDto>().ReverseMap();
        CreateMap<ResourcePlanner, ResourcePlannerDto>().ReverseMap();
        CreateMap<BO, BODto>().ReverseMap();
        CreateMap<WorksOn, WorksOnDto>().ReverseMap();
        CreateMap<OxExe, OxExeDto>().ReverseMap();
    }
}
