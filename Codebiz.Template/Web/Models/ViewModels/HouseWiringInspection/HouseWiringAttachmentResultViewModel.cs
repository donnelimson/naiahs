﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Web.Models.ViewModels.Member
{
    public class HouseWiringAttachmentResultViewModel
    {
        public int? houseWiringId { get; set; }
        public int? memberId { get; set; }
        public string name { get; set; }
        public string origName { get; set; }
        //public long? size { get; set; }
        public int? fileTypeId { get; set; }
        public string fileType { get; set; }
        public string url { get; set; }
        public string thumbnailUrl { get; set; }
        public string downloadUrl { get; set; }
        public string deleteType { get; set; }
        public string deleteUrl { get; set; }
        //public bool isActiveFile { get; set; }
        //public DateTime uploadDate { get; set; }
    }
}