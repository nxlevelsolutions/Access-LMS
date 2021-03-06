﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace NXLevel.LMS.DataModel
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class lms_Entities : DbContext
    {
        public lms_Entities()
            : base("name=lms_Entities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Course> Courses { get; set; }
        public virtual DbSet<Group> Groups { get; set; }
        public virtual DbSet<Email> Emails { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Assignment> Assignments { get; set; }
        public virtual DbSet<Courses_Scores> Courses_Scores { get; set; }
        public virtual DbSet<Courses_Usage> Courses_Usage { get; set; }
    
        public virtual ObjectResult<User_Curriculum_Result> User_Curriculum(Nullable<int> userId)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<User_Curriculum_Result>("User_Curriculum", userIdParameter);
        }
    
        public virtual int Course_Started(Nullable<int> userId, Nullable<int> courseId)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var courseIdParameter = courseId.HasValue ?
                new ObjectParameter("courseId", courseId) :
                new ObjectParameter("courseId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Course_Started", userIdParameter, courseIdParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> Course_ScormValueSet(Nullable<int> userId, Nullable<int> assignmentId, Nullable<int> courseId, string key, string val)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var courseIdParameter = courseId.HasValue ?
                new ObjectParameter("courseId", courseId) :
                new ObjectParameter("courseId", typeof(int));
    
            var keyParameter = key != null ?
                new ObjectParameter("key", key) :
                new ObjectParameter("key", typeof(string));
    
            var valParameter = val != null ?
                new ObjectParameter("val", val) :
                new ObjectParameter("val", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("Course_ScormValueSet", userIdParameter, assignmentIdParameter, courseIdParameter, keyParameter, valParameter);
        }
    
        public virtual ObjectResult<Course_BasicInfo_Result> Course_BasicInfo(Nullable<int> assignmentId, Nullable<int> courseId, Nullable<int> userId)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var courseIdParameter = courseId.HasValue ?
                new ObjectParameter("courseId", courseId) :
                new ObjectParameter("courseId", typeof(int));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Course_BasicInfo_Result>("Course_BasicInfo", assignmentIdParameter, courseIdParameter, userIdParameter);
        }
    
        public virtual ObjectResult<Course_StartupDefaults_Result> Course_StartupDefaults(Nullable<int> userId, Nullable<int> assignmentId, Nullable<int> courseId)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var courseIdParameter = courseId.HasValue ?
                new ObjectParameter("courseId", courseId) :
                new ObjectParameter("courseId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Course_StartupDefaults_Result>("Course_StartupDefaults", userIdParameter, assignmentIdParameter, courseIdParameter);
        }
    
        public virtual ObjectResult<User_Info_Result> User_Info(string email)
        {
            var emailParameter = email != null ?
                new ObjectParameter("email", email) :
                new ObjectParameter("email", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<User_Info_Result>("User_Info", emailParameter);
        }
    
        public virtual ObjectResult<Users_All_Result> Users_All(Nullable<int> pageIndex, Nullable<int> pageSize, string sortField, ObjectParameter recordCount)
        {
            var pageIndexParameter = pageIndex.HasValue ?
                new ObjectParameter("PageIndex", pageIndex) :
                new ObjectParameter("PageIndex", typeof(int));
    
            var pageSizeParameter = pageSize.HasValue ?
                new ObjectParameter("PageSize", pageSize) :
                new ObjectParameter("PageSize", typeof(int));
    
            var sortFieldParameter = sortField != null ?
                new ObjectParameter("SortField", sortField) :
                new ObjectParameter("SortField", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Users_All_Result>("Users_All", pageIndexParameter, pageSizeParameter, sortFieldParameter, recordCount);
        }
    
        public virtual int User_OrgGroupSet(string orgGroupTitle, string orgGroupValue, Nullable<int> userId)
        {
            var orgGroupTitleParameter = orgGroupTitle != null ?
                new ObjectParameter("OrgGroupTitle", orgGroupTitle) :
                new ObjectParameter("OrgGroupTitle", typeof(string));
    
            var orgGroupValueParameter = orgGroupValue != null ?
                new ObjectParameter("OrgGroupValue", orgGroupValue) :
                new ObjectParameter("OrgGroupValue", typeof(string));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("User_OrgGroupSet", orgGroupTitleParameter, orgGroupValueParameter, userIdParameter);
        }
    
        public virtual int Group_UsersSet(Nullable<int> groupId, string userlist)
        {
            var groupIdParameter = groupId.HasValue ?
                new ObjectParameter("groupId", groupId) :
                new ObjectParameter("groupId", typeof(int));
    
            var userlistParameter = userlist != null ?
                new ObjectParameter("userlist", userlist) :
                new ObjectParameter("userlist", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Group_UsersSet", groupIdParameter, userlistParameter);
        }
    
        public virtual ObjectResult<AssignmentsStats_Result> AssignmentsStats(Nullable<int> assignemntType)
        {
            var assignemntTypeParameter = assignemntType.HasValue ?
                new ObjectParameter("AssignemntType", assignemntType) :
                new ObjectParameter("AssignemntType", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<AssignmentsStats_Result>("AssignmentsStats", assignemntTypeParameter);
        }
    
        public virtual int Assignment_CoursesSet(Nullable<int> assignmentId, string courselist)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var courselistParameter = courselist != null ?
                new ObjectParameter("courselist", courselist) :
                new ObjectParameter("courselist", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Assignment_CoursesSet", assignmentIdParameter, courselistParameter);
        }
    
        public virtual ObjectResult<Assignment_CoursesGet_Result> Assignment_CoursesGet(Nullable<int> assignmentId)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Assignment_CoursesGet_Result>("Assignment_CoursesGet", assignmentIdParameter);
        }
    
        public virtual ObjectResult<Group_UsersGet_Result> Group_UsersGet(Nullable<int> groupId)
        {
            var groupIdParameter = groupId.HasValue ?
                new ObjectParameter("groupId", groupId) :
                new ObjectParameter("groupId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Group_UsersGet_Result>("Group_UsersGet", groupIdParameter);
        }
    
        public virtual ObjectResult<Assignment_GroupsGet_Result> Assignment_GroupsGet(Nullable<int> assignmentId)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Assignment_GroupsGet_Result>("Assignment_GroupsGet", assignmentIdParameter);
        }
    
        public virtual int Assignment_GroupsSet(Nullable<int> assignmentId, string grouplist)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var grouplistParameter = grouplist != null ?
                new ObjectParameter("grouplist", grouplist) :
                new ObjectParameter("grouplist", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Assignment_GroupsSet", assignmentIdParameter, grouplistParameter);
        }
    
        public virtual ObjectResult<Categories_GroupsGet_Result> Categories_GroupsGet(Nullable<int> categoryId)
        {
            var categoryIdParameter = categoryId.HasValue ?
                new ObjectParameter("categoryId", categoryId) :
                new ObjectParameter("categoryId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Categories_GroupsGet_Result>("Categories_GroupsGet", categoryIdParameter);
        }
    
        public virtual int Categories_GroupsSet(Nullable<int> categoryId, Nullable<int> groupId, string title, Nullable<bool> enabled)
        {
            var categoryIdParameter = categoryId.HasValue ?
                new ObjectParameter("categoryId", categoryId) :
                new ObjectParameter("categoryId", typeof(int));
    
            var groupIdParameter = groupId.HasValue ?
                new ObjectParameter("groupId", groupId) :
                new ObjectParameter("groupId", typeof(int));
    
            var titleParameter = title != null ?
                new ObjectParameter("title", title) :
                new ObjectParameter("title", typeof(string));
    
            var enabledParameter = enabled.HasValue ?
                new ObjectParameter("enabled", enabled) :
                new ObjectParameter("enabled", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Categories_GroupsSet", categoryIdParameter, groupIdParameter, titleParameter, enabledParameter);
        }
    
        public virtual int Categories_GroupsDelete(Nullable<int> categoryId, Nullable<int> groupId)
        {
            var categoryIdParameter = categoryId.HasValue ?
                new ObjectParameter("categoryId", categoryId) :
                new ObjectParameter("categoryId", typeof(int));
    
            var groupIdParameter = groupId.HasValue ?
                new ObjectParameter("groupId", groupId) :
                new ObjectParameter("groupId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Categories_GroupsDelete", categoryIdParameter, groupIdParameter);
        }
    
        public virtual ObjectResult<Assignment_UsersGet_Result> Assignment_UsersGet(Nullable<int> assignmentId, Nullable<bool> returnAll)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var returnAllParameter = returnAll.HasValue ?
                new ObjectParameter("returnAll", returnAll) :
                new ObjectParameter("returnAll", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Assignment_UsersGet_Result>("Assignment_UsersGet", assignmentIdParameter, returnAllParameter);
        }
    
        public virtual int Assignment_UsersSet(Nullable<int> assignmentId, string userlist, Nullable<bool> add)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var userlistParameter = userlist != null ?
                new ObjectParameter("userlist", userlist) :
                new ObjectParameter("userlist", typeof(string));
    
            var addParameter = add.HasValue ?
                new ObjectParameter("add", add) :
                new ObjectParameter("add", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Assignment_UsersSet", assignmentIdParameter, userlistParameter, addParameter);
        }
    
        public virtual ObjectResult<User_GroupsGet_Result> User_GroupsGet(Nullable<int> userId)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<User_GroupsGet_Result>("User_GroupsGet", userIdParameter);
        }
    
        public virtual int User_GroupsSet(Nullable<int> userId, string grouplist)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var grouplistParameter = grouplist != null ?
                new ObjectParameter("grouplist", grouplist) :
                new ObjectParameter("grouplist", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("User_GroupsSet", userIdParameter, grouplistParameter);
        }
    
        public virtual int User_CategoryGroupSet(Nullable<int> userId, string categoryTitle, string groupTitle)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var categoryTitleParameter = categoryTitle != null ?
                new ObjectParameter("CategoryTitle", categoryTitle) :
                new ObjectParameter("CategoryTitle", typeof(string));
    
            var groupTitleParameter = groupTitle != null ?
                new ObjectParameter("GroupTitle", groupTitle) :
                new ObjectParameter("GroupTitle", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("User_CategoryGroupSet", userIdParameter, categoryTitleParameter, groupTitleParameter);
        }
    
        public virtual int Assignment_Delete(Nullable<int> assignmentId)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("Assignment_Delete", assignmentIdParameter);
        }
    
        public virtual ObjectResult<Report_Users_All_Result> Report_Users_All(Nullable<int> pageIndex, Nullable<int> pageSize, string sortField, ObjectParameter recordCount)
        {
            var pageIndexParameter = pageIndex.HasValue ?
                new ObjectParameter("PageIndex", pageIndex) :
                new ObjectParameter("PageIndex", typeof(int));
    
            var pageSizeParameter = pageSize.HasValue ?
                new ObjectParameter("PageSize", pageSize) :
                new ObjectParameter("PageSize", typeof(int));
    
            var sortFieldParameter = sortField != null ?
                new ObjectParameter("SortField", sortField) :
                new ObjectParameter("SortField", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Report_Users_All_Result>("Report_Users_All", pageIndexParameter, pageSizeParameter, sortFieldParameter, recordCount);
        }
    
        public virtual ObjectResult<Report_UserCourses_Result> Report_UserCourses(Nullable<int> userId)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Report_UserCourses_Result>("Report_UserCourses", userIdParameter);
        }
    
        public virtual ObjectResult<Report_CourseUsers_Result> Report_CourseUsers(Nullable<int> courseId)
        {
            var courseIdParameter = courseId.HasValue ?
                new ObjectParameter("courseId", courseId) :
                new ObjectParameter("courseId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Report_CourseUsers_Result>("Report_CourseUsers", courseIdParameter);
        }
    
        public virtual ObjectResult<Report_AssignmentGroups_Result> Report_AssignmentGroups(Nullable<int> assignmentId)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Report_AssignmentGroups_Result>("Report_AssignmentGroups", assignmentIdParameter);
        }
    
        public virtual ObjectResult<Report_CategoryGroups_Result> Report_CategoryGroups(Nullable<int> categoryId)
        {
            var categoryIdParameter = categoryId.HasValue ?
                new ObjectParameter("categoryId", categoryId) :
                new ObjectParameter("categoryId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Report_CategoryGroups_Result>("Report_CategoryGroups", categoryIdParameter);
        }
    
        public virtual ObjectResult<Nullable<bool>> User_Email(Nullable<int> assignmentId, Nullable<int> userId, Nullable<int> emailId)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var emailIdParameter = emailId.HasValue ?
                new ObjectParameter("emailId", emailId) :
                new ObjectParameter("emailId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<bool>>("User_Email", assignmentIdParameter, userIdParameter, emailIdParameter);
        }
    
        public virtual ObjectResult<User_UsageHistory_Result> User_UsageHistory(Nullable<int> userId, Nullable<int> assignmentId, Nullable<int> courseId)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var courseIdParameter = courseId.HasValue ?
                new ObjectParameter("courseId", courseId) :
                new ObjectParameter("courseId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<User_UsageHistory_Result>("User_UsageHistory", userIdParameter, assignmentIdParameter, courseIdParameter);
        }
    
        public virtual ObjectResult<Courses_Avail_Result> Courses_Avail(Nullable<bool> enabled)
        {
            var enabledParameter = enabled.HasValue ?
                new ObjectParameter("enabled", enabled) :
                new ObjectParameter("enabled", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Courses_Avail_Result>("Courses_Avail", enabledParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> Assignment_CoursesCompletedGet(Nullable<int> assignmentId, Nullable<int> userId)
        {
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("Assignment_CoursesCompletedGet", assignmentIdParameter, userIdParameter);
        }
    
        public virtual ObjectResult<User_EmailsSent_Result> User_EmailsSent(Nullable<int> userId, Nullable<int> assignmentId)
        {
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<User_EmailsSent_Result>("User_EmailsSent", userIdParameter, assignmentIdParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> Users_EmailsNotSent(string userListStr, Nullable<int> assignmentId, Nullable<int> emailId)
        {
            var userListStrParameter = userListStr != null ?
                new ObjectParameter("userListStr", userListStr) :
                new ObjectParameter("userListStr", typeof(string));
    
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var emailIdParameter = emailId.HasValue ?
                new ObjectParameter("emailId", emailId) :
                new ObjectParameter("emailId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("Users_EmailsNotSent", userListStrParameter, assignmentIdParameter, emailIdParameter);
        }
    
        public virtual ObjectResult<Nullable<int>> Users_Email_Add(string userListStr, Nullable<int> assignmentId, Nullable<int> emailId)
        {
            var userListStrParameter = userListStr != null ?
                new ObjectParameter("userListStr", userListStr) :
                new ObjectParameter("userListStr", typeof(string));
    
            var assignmentIdParameter = assignmentId.HasValue ?
                new ObjectParameter("assignmentId", assignmentId) :
                new ObjectParameter("assignmentId", typeof(int));
    
            var emailIdParameter = emailId.HasValue ?
                new ObjectParameter("emailId", emailId) :
                new ObjectParameter("emailId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<Nullable<int>>("Users_Email_Add", userListStrParameter, assignmentIdParameter, emailIdParameter);
        }
    }
}
