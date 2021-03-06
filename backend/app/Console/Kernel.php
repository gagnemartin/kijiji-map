<?php

namespace App\Console;

use Awjudd\FeedReader\Facades\FeedReader;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Ad;
use PHPHtmlParser\Dom;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();

        $schedule->call(function() {
            $ads = Ad::select('id', 'url')->get();
            $deleteIds = [];

            foreach($ads as $ad) {
                $dom = new Dom;
                $dom->load($ad->url);
                $numRooms = $dom->find('dd.attributeValue-2574930263')[0];

                if (!$numRooms) {
                    $deleteIds[] = $ad->id;
                }
            }

            if (count($deleteIds) > 0) {
                Ad::destroy($deleteIds);
            }
        })->twiceDaily();

        $schedule->call(function() {
            $feed = FeedReader::read('https://www.kijiji.ca/rss-srp-appartement-condo/ville-de-montreal/c37l1700281?ad=offering');
            $now = Carbon::now('utc')->toDateTimeString();

            //dd($feed->get_items());

            foreach ($feed->get_items() as $item) {
                $price = $item->get_item_tags('http://base.google.com/ns/1.0', 'price')[0];
                $price = (int) $price['data'];
                $price = $price === 0 ? null : $price;
                $date = $item->get_item_tags('http://purl.org/dc/elements/1.1/', 'date')[0];
                $thumbnail = $item->get_enclosure();

                $dom = new Dom;
                $dom->load($item->get_link());
                $numRooms = $dom->find('dd.attributeValue-2574930263')[0];

                if ($numRooms) {
                    $boom = explode(' ', $numRooms->text());
                    $numRooms = (float) ((int) $boom[0] + 0.5);
                }

                $item = [
                    'name' => htmlspecialchars_decode($item->get_title()),
                    'url' => $item->get_link(),
                    'description' => htmlspecialchars_decode($item->get_description()),
                    'price' => $price,
                    'thumbnail' => $thumbnail->link,
                    'lat' => (float) $item->get_latitude(),
                    'lng' => (float) $item->get_longitude(),
                    //'city' => 'montreal',
                    'rooms' => $numRooms,
                    'publish_date' => Carbon::parse($date['data']),
                    'created_at'=> $now,
                    'modified_at'=> $now
                ];

                Ad::firstOrCreate(['url' => $item['url']], $item);
            }

        })->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
