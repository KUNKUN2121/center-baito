<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShiftSubmission extends Model
{
    //
    protected $fillable = [
        'user_id',
        'schedule_id',
        'start_datetime',
        'end_datetime',
        'status',
        'notes',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function schedule()
    {
        return $this->hasOne(Schedule::class);
    }


}
