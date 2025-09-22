<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'shift_submission_id',
        'scheduled_start_datetime',
        'scheduled_end_datetime',
        'status',
    ];

    public function shiftSubmission()
    {
        return $this->belongsTo(ShiftSubmission::class);
    }
}
