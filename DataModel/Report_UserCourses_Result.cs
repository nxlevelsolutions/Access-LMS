//------------------------------------------------------------------------------
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
    
    public partial class Report_UserCourses_Result
    {
        public int courseId { get; set; }
        public Nullable<System.DateTime> startedDate { get; set; }
        public Nullable<System.DateTime> endDate { get; set; }
        public Nullable<decimal> avgScore { get; set; }
        public Nullable<decimal> maxScore { get; set; }
        public int assignmentId { get; set; }
        public string assignmentTitle { get; set; }
        public string courseTitle { get; set; }
    }
}
