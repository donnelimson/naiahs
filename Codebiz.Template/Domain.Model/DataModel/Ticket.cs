﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Codebiz.Domain.Common.Model.DataModel
{
    public class Ticket:ModelBase
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(100)]
        public string Title { get; set; }
        public int Priority { get; set; } //1,2,3,4 so forth
        public bool IsParent { get; set; }
        public bool IsChild { get; set; }
    }
    public class Subticket:ModelBase
    {
        [Key]
        public int SubticketId { get; set; }
        [ForeignKey("Ticket")]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }
    }
    public class TicketComment : ModelBase
    {
        [Key]
        public int TicketCommentId { get; set; }
        [ForeignKey("Ticket")]
        public int TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }
    }
    public class TicketAttachment:ModelBase
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("ContentFile")]
        public int ContentFileId { get; set; }
        public virtual ContentFile ContentFile { get; set; }
        [ForeignKey("Ticket")]
        public int? TicketId { get; set; }
        public virtual Ticket Ticket { get; set; }
    }
}
