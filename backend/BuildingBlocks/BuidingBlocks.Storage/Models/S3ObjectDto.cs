﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BuidingBlocks.Storage.Models
{
    public class S3ObjectDto
    {
        public string? Name { get; set; }
        public string? PresignedUrl {  get; set; }
    }
}
