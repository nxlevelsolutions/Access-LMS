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
    
    public partial class Courses_Avail_Result
    {
        public int courseId { get; set; }
        public bool enabled { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string url { get; set; }
        public Nullable<int> browserWidth { get; set; }
        public Nullable<int> browserHeight { get; set; }
        public Nullable<bool> inUse { get; set; }
        public System.DateTime timestamp { get; set; }
        public short type { get; set; }
        public string extra1 { get; set; }
        public string extra2 { get; set; }
    }
}
