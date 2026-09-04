/**
 * The calendar as it stands the first time a site is deployed.
 *
 * This lives beside the function, not in capacity/index.html, because the
 * published HTML is public: anything in it is readable by anyone who opens the
 * page source, code or no code. Netlify bundles this module into the function,
 * so it is only ever reachable through an authorised request.
 *
 * The store takes over after the first write; editing this file only affects a
 * brand-new deployment.
 */
export default {
  "rev": 50,
  "updatedAt": "2026-09-03T22:05:02.588Z",
  "quarters": [
    {
      "id": "2026Q3",
      "label": "Q3 2026",
      "months": [
        {
          "key": "2026-07",
          "label": "July 2026",
          "short": "July",
          "start": "2026-06-28"
        },
        {
          "key": "2026-08",
          "label": "August 2026",
          "short": "August",
          "start": "2026-08-02"
        },
        {
          "key": "2026-09",
          "label": "September 2026",
          "short": "September",
          "start": "2026-09-06"
        }
      ]
    },
    {
      "id": "2026Q4",
      "label": "Q4 2026",
      "months": [
        {
          "key": "2026-10",
          "label": "October 2026",
          "short": "October",
          "start": "2026-09-27"
        },
        {
          "key": "2026-11",
          "label": "November 2026",
          "short": "November",
          "start": "2026-11-01"
        },
        {
          "key": "2026-12",
          "label": "December 2026",
          "short": "December",
          "start": "2026-12-06"
        }
      ]
    },
    {
      "id": "2027Q1",
      "label": "Q1 2027",
      "months": [
        {
          "key": "2027-01",
          "label": "January 2027",
          "short": "January",
          "start": "2026-12-27"
        },
        {
          "key": "2027-02",
          "label": "February 2027",
          "short": "February",
          "start": "2027-01-31"
        },
        {
          "key": "2027-03",
          "label": "March 2027",
          "short": "March",
          "start": "2027-03-07"
        }
      ]
    },
    {
      "id": "2027Q2",
      "label": "Q2 2027",
      "months": [
        {
          "key": "2027-04",
          "label": "April 2027",
          "short": "April",
          "start": "2027-03-28"
        },
        {
          "key": "2027-05",
          "label": "May 2027",
          "short": "May",
          "start": "2027-05-02"
        },
        {
          "key": "2027-06",
          "label": "June 2027",
          "short": "June",
          "start": "2027-06-06"
        }
      ]
    },
    {
      "id": "2027Q3",
      "label": "Q3 2027",
      "months": [
        {
          "key": "2027-07",
          "label": "July 2027",
          "short": "July",
          "start": "2027-06-27"
        },
        {
          "key": "2027-08",
          "label": "August 2027",
          "short": "August",
          "start": "2027-08-01"
        },
        {
          "key": "2027-09",
          "label": "September 2027",
          "short": "September",
          "start": "2027-09-05"
        }
      ]
    },
    {
      "id": "2027Q4",
      "label": "Q4 2027",
      "months": [
        {
          "key": "2027-10",
          "label": "October 2027",
          "short": "October",
          "start": "2027-09-26"
        },
        {
          "key": "2027-11",
          "label": "November 2027",
          "short": "November",
          "start": "2027-10-31"
        },
        {
          "key": "2027-12",
          "label": "December 2027",
          "short": "December",
          "start": "2027-12-05"
        }
      ]
    }
  ],
  "targets": {
    "weekTotal": 12,
    "weekPrime": 5,
    "monthTotal": 50,
    "monthPrime": 25
  },
  "branches": [
    {
      "code": "SYR",
      "reps": [
        {
          "id": "syr16",
          "name": "Andrew Rivera",
          "slots": {
            "2026-09-06|AM": 1,
            "2026-09-06|MID": 1,
            "2026-09-06|PM": 1,
            "2026-09-08|AM": 1,
            "2026-09-09|MID": 1,
            "2026-09-08|MID": 1,
            "2026-09-08|PM": 1,
            "2026-09-09|PM": 1,
            "2026-09-10|PM": 1,
            "2026-09-10|MID": 1,
            "2026-09-10|AM": 1,
            "2026-09-12|AM": 1,
            "2026-09-12|MID": 1,
            "2026-09-12|PM": 1,
            "2026-09-13|AM": 1,
            "2026-09-13|MID": 1,
            "2026-09-13|PM": 1,
            "2026-09-15|AM": 1,
            "2026-09-15|MID": 1,
            "2026-09-15|PM": 1,
            "2026-09-16|MID": 1,
            "2026-09-16|PM": 1,
            "2026-09-17|AM": 1,
            "2026-09-17|MID": 1,
            "2026-09-17|PM": 1,
            "2026-09-19|AM": 1,
            "2026-09-19|MID": 1,
            "2026-09-19|PM": 1,
            "2026-09-20|AM": 1,
            "2026-09-20|MID": 1,
            "2026-09-20|PM": 1,
            "2026-09-22|AM": 1,
            "2026-09-22|MID": 1,
            "2026-09-22|PM": 1,
            "2026-09-23|MID": 1,
            "2026-09-23|PM": 1,
            "2026-09-24|AM": 1,
            "2026-09-24|MID": 1,
            "2026-09-24|PM": 1,
            "2026-09-26|AM": 1,
            "2026-09-26|MID": 1,
            "2026-09-26|PM": 1,
            "2026-09-27|AM": 1,
            "2026-09-27|MID": 1,
            "2026-09-27|PM": 1,
            "2026-09-29|AM": 1,
            "2026-09-29|MID": 1,
            "2026-09-29|PM": 1,
            "2026-09-30|MID": 1,
            "2026-09-30|PM": 1,
            "2026-10-01|AM": 1,
            "2026-10-01|MID": 1,
            "2026-10-01|PM": 1,
            "2026-10-03|AM": 1,
            "2026-10-03|MID": 1,
            "2026-10-03|PM": 1,
            "2026-10-04|AM": 1,
            "2026-10-04|MID": 1,
            "2026-10-04|PM": 1,
            "2026-10-06|AM": 1,
            "2026-10-06|MID": 1,
            "2026-10-06|PM": 1,
            "2026-10-07|MID": 1,
            "2026-10-07|PM": 1,
            "2026-10-08|AM": 1,
            "2026-10-08|MID": 1,
            "2026-10-08|PM": 1,
            "2026-10-10|AM": 1,
            "2026-10-10|MID": 1,
            "2026-10-10|PM": 1,
            "2026-09-18|AM": 1,
            "2026-09-18|MID": 1,
            "2026-09-18|PM": 1,
            "2026-09-25|AM": 1,
            "2026-09-25|MID": 1,
            "2026-09-25|PM": 1,
            "2026-10-02|AM": 1,
            "2026-10-02|MID": 1,
            "2026-10-02|PM": 1,
            "2026-10-09|AM": 1,
            "2026-10-09|MID": 1,
            "2026-10-09|PM": 1
          },
          "timeOff": {},
          "status": {},
          "daysOff": {
            "1": 1
          },
          "dateOff": {
            "2026-09-11": 1
          }
        },
        {
          "id": "r13",
          "name": "Brodye Condy",
          "slots": {
            "2026-09-06|AM": 1,
            "2026-09-06|MID": 1,
            "2026-09-06|PM": 1,
            "2026-09-07|PM": 1,
            "2026-09-07|MID": 1,
            "2026-09-07|AM": 1,
            "2026-09-08|AM": 1,
            "2026-09-08|MID": 1,
            "2026-09-08|PM": 1,
            "2026-09-09|PM": 1,
            "2026-09-09|MID": 1,
            "2026-09-09|AM": 1,
            "2026-09-10|AM": 1,
            "2026-09-10|MID": 1,
            "2026-09-10|PM": 1,
            "2026-09-11|PM": 1,
            "2026-09-11|MID": 1,
            "2026-09-11|AM": 1,
            "2026-09-12|AM": 1,
            "2026-09-12|MID": 1,
            "2026-09-12|PM": 1
          },
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "syr18",
          "name": "Cameron Lewis",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "r12",
          "name": "Chris Brown",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {
            "4": 1
          },
          "dateOff": {}
        },
        {
          "id": "syr17",
          "name": "Harold Rose",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {
            "2": 1
          },
          "dateOff": {}
        },
        {
          "id": "r7",
          "name": "Jonathan Helms",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "r10",
          "name": "Nate Holland",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {
            "5": 1
          },
          "dateOff": {}
        },
        {
          "id": "r11",
          "name": "Tom Redfield",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        }
      ],
      "division": "KQ"
    },
    {
      "code": "WCH",
      "reps": [
        {
          "id": "wch2",
          "name": "Craig Couse",
          "slots": {
            "2026-09-06|AM": 1,
            "2026-09-06|MID": 1,
            "2026-09-06|PM": 1,
            "2026-09-08|MID": 1,
            "2026-09-08|AM": 1,
            "2026-09-10|PM": 1,
            "2026-09-11|AM": 1,
            "2026-09-12|MID": 1,
            "2026-09-12|PM": 1,
            "2026-09-09|PM": 1
          },
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {
            "2026-09-07": 1
          }
        },
        {
          "id": "boh34",
          "name": "Danny Berisha",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {
            "2026-09-07": 1
          }
        },
        {
          "id": "wch1",
          "name": "Paolo De Rosa",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {
            "5": 1
          },
          "dateOff": {
            "2026-09-07": 1
          }
        },
        {
          "id": "wch3",
          "name": "Patrick Madison",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "wch-1",
          "name": "Samuel Rodriguez",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        }
      ],
      "division": "KQ"
    },
    {
      "code": "BOH",
      "reps": [
        {
          "id": "boh32",
          "name": "Andrew Saulino",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh3",
          "name": "Christian Enright",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh8",
          "name": "Dallas Brett",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh4",
          "name": "Derek Navarro",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh2",
          "name": "Frank Bachard",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh7",
          "name": "Gregg Catalano",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh36",
          "name": "Jacob Meier",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh6",
          "name": "Joseph Livoti",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh5",
          "name": "Kirk Davidson",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "r4",
          "name": "Marc Simonian",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh1",
          "name": "Maurice Haughton",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "r14",
          "name": "Perry Kleemann",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh38",
          "name": "Phillip Eareckson",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh40",
          "name": "Ridge Dufek",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh42",
          "name": "Scott Crafa",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "boh9",
          "name": "Sebastian Henao",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        }
      ],
      "division": "KQ"
    },
    {
      "code": "WER",
      "division": "BACH",
      "reps": [
        {
          "id": "wer-1",
          "name": "William Martin",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "wer-2",
          "name": "Jordan Oliver",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "wer-3",
          "name": "Steven Duhovis",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "wer-4",
          "name": "Albert Powell",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "wer-5",
          "name": "Ben Anderson",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        }
      ],
      "name": "Wernersville"
    },
    {
      "code": "MTG",
      "division": "BACH",
      "reps": [
        {
          "id": "mtg-6",
          "name": "Louis Cohen",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mtg-7",
          "name": "Chris Ruyak",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mtg-8",
          "name": "Alexander Selyukov",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mtg-9",
          "name": "Alexander Ruperto",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mtg-10",
          "name": "Brian Decesare",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mtg-11",
          "name": "Jeremy Marshall",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mtg-12",
          "name": "Jason Friedman",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mtg-13",
          "name": "Louis Difrancesco",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        }
      ],
      "name": "Montgomery County"
    },
    {
      "code": "MTS",
      "division": "BACH",
      "reps": [
        {
          "id": "mts-14",
          "name": "Jessie Rivas",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mts-15",
          "name": "Shayle Durkin",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mts-16",
          "name": "Uriel Mendoza",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "mts-17",
          "name": "Nicholas Sanguiolo",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        }
      ]
    },
    {
      "code": "LHV",
      "division": "BACH",
      "reps": [
        {
          "id": "lhv-18",
          "name": "Anthony Rizzo",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "lhv-19",
          "name": "Luis Mortimer",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "lhv-20",
          "name": "John Usavage",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "lhv-21",
          "name": "Zach Stahr",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        },
        {
          "id": "lhv-22",
          "name": "Nick Gordon",
          "slots": {},
          "timeOff": {},
          "status": {},
          "daysOff": {},
          "dateOff": {}
        }
      ],
      "name": "Lehigh Valley"
    }
  ],
  "rosterVersion": 4,
  "blocks": [
    {
      "id": "blk-sales-meeting",
      "label": "Sales Meeting",
      "scope": "KQ",
      "dow": 3,
      "slot": "AM"
    }
  ],
  "divisions": [
    {
      "code": "KQ",
      "label": "King Quality"
    },
    {
      "code": "BACH",
      "label": "Bachman"
    }
  ]
};
