<?php

namespace App\Http\Controllers;

use App\Ad;
use Awjudd\FeedReader\Facades\FeedReader;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use PHPHtmlParser\Dom;

class AdController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->all();
        $query = Ad::orderByDesc('publish_date');

        if (isset($filters['price'])) {
            $query->where('price', '<', $filters['price']);
        }
        if (isset($filters['rooms'])) {
            $query->where('rooms', $filters['rooms']);
        }

        $ads = $query->get();

        return response()->json($ads, 200);
    }

//    public function getNumberOfRooms()
//    {
//        $ads = Ad::select('id', 'url')->get();
//        $dom = new Dom;
//        $rooms = [];
//
//        foreach ($ads as $ad) {
//            $dom->load($ad->url);
//            $numRooms = $dom->find('dd.attributeValue-2574930263')[0];
//
//            if (isset($numRooms)) {
//                $boom = explode(' ', $numRooms->text());
//                $numRooms = (float) ((int) $boom[0] + 0.5);
//                $rooms[] = Ad::where('id', $ad->id)->update(['rooms' => $numRooms]);
//            }
//        }
//
//        return response()->json($rooms, 200);
//    }

//    public function getFeed()
//    {
//        $feed = FeedReader::read('https://www.kijiji.ca/rss-srp-appartement-condo/ville-de-montreal/c37l1700281?ad=offering');
//        $now = Carbon::now();
//        $items = [];
//
//        //dd($feed->get_items());
//
//        foreach ($feed->get_items() as $item) {
//            $price = $item->get_item_tags('http://base.google.com/ns/1.0', 'price')[0];
//            $date = $item->get_item_tags('http://purl.org/dc/elements/1.1/', 'date')[0];
//            $thumbnail = $item->get_enclosure();
//            $price = (int) $price['data'];
//
//            array_push($items, [
//                'title' => htmlspecialchars_decode($item->get_title()),
//                'url' => $item->get_link(),
//                'description' => htmlspecialchars_decode($item->get_description()),
//                'price' => $price === 0 ? null : $price,
//                'thumbnail' => $thumbnail->link,
//                'publish_date' => Carbon::parse($date['data']),
//                'coords' => [
//                    'lat' => $item->get_latitude(),
//                    'lng' => $item->get_longitude(),
//                ],
//                'created_at'=> $now,
//                'modified_at'=> $now
//            ]);
//        }
//
//        return response()->json([
//            'feed' => $items
//        ], 200);
//    }
}
