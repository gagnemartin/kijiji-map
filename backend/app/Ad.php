<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'lat',
        'lng',
        'url',
        'thumbnail',
        'publish_date'
    ];
}
