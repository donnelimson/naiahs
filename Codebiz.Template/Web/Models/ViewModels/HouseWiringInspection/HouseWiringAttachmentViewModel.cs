﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Web.Models.ViewModels.Member
{
    public class HouseWiringAttachmentViewModel
    {
        public int HouseWiringAttachmentId { get; set; }
        public string OrigName { get; set; }
        public string FileType { get; set; }
        public int HouseWiringId { get; set; }
        public int ContentFileId { get; set; }

        public string name { get; set; }
        public string url { get; set; }
        public string type { get; set; }
        public string thumbnailUrl { get; set; }
        public string deleteUrl { get; set; }






    }
}