<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    //

    // リレーション設定
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shiftChangeRequests()
    {
        return $this->hasMany(ShiftChangeRequest::class);
    }

    public function shiftHistories()
    {
        return $this->hasMany(ShiftHistory::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }

    protected $fillable = [
        'schedule_id',
        'user_id',
        'start_datetime',
        'end_datetime',
        'notes',
    ];


}
