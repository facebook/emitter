/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventSubscriptionVendor
 * @typechecks
 */

'use strict';

const invariant = require('invariant');

/**
 * EventSubscriptionVendor stores a set of EventSubscriptions that are
 * subscribed to a particular event type.
 */
class EventSubscriptionVendor {
  constructor() {
    this._subscriptionsForType = {};
    this._currentSubscription = null;
  }

  /**
   * Adds a subscription keyed by an event type.
   *
   * @param {string} eventType
   * @param {EventSubscription} subscription
   */
  addSubscription(
    eventType: String,
    subscription: EventSubscription,
  ): EventSubscription {
    invariant(
      subscription.subscriber === this,
      'The subscriber of the subscription is incorrectly set.',
    );
    if (!this._subscriptionsForType[eventType]) {
      this._subscriptionsForType[eventType] = [];
    }
    var key = this._subscriptionsForType[eventType].length;
    this._subscriptionsForType[eventType].push(subscription);
    subscription.eventType = eventType;
    subscription.key = key;
    return subscription;
  }

  /**
   * Removes a bulk set of the subscriptions.
   *
   * @param {?string} eventType - Optional name of the event type whose
   *   registered supscriptions to remove, if null remove all subscriptions.
   */
  removeAllSubscriptions(eventType: ?String) {
    if (eventType === undefined) {
      this._subscriptionsForType = {};
    } else {
      delete this._subscriptionsForType[eventType];
    }
  }

  /**
   * Removes a specific subscription. Instead of calling this function, call
   * `subscription.remove()` directly.
   *
   * @param {object} subscription
   */
  removeSubscription(subscription: Object) {
    var eventType = subscription.eventType;
    var key = subscription.key;

    var subscriptionsForType = this._subscriptionsForType[eventType];
    if (subscriptionsForType) {
      delete subscriptionsForType[key];
    }
  }

  /**
   * Returns the array of subscriptions that are currently registered for the
   * given event type.
   *
   * Note: This array can be potentially sparse as subscriptions are deleted
   * from it when they are removed.
   *
   * TODO: This returns a nullable array. wat?
   *
   * @param {string} eventType
   * @return {?array}
   */
  getSubscriptionsForType(eventType: String): ?Array {
    return this._subscriptionsForType[eventType];
  }
}

module.exports = EventSubscriptionVendor;
